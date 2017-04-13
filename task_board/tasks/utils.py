from task_board.tasks.models import Task


def create_sample_tasks(owner=None, count=15):
    assert owner, "Please specify the owner for tasks."

    for idx in range(count):
        task_data = dict(
            name='Task number %d' % (idx + 1),
            description='Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante '
                        'sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra '
                        'turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue '
                        'felis in faucibus.',
            created_by=owner,
        )

        Task.objects.create(**task_data)
